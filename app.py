# * ---------- IMPORTS --------- *
import os
import time
import threading
import importlib
import psycopg2
import cv2
import numpy as np
from flask import Flask, request, jsonify, Response, render_template
from flask_cors import CORS, cross_origin
from imutils import video, resize
import facial_recognition


# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful for multiple browsers/tabs
# that are viewing the stream)
output_frame = None
lock = threading.Lock()

# Get the relative path to this file (we will use it later)
FILE_PATH = os.path.dirname(os.path.realpath(__file__))

# initialize the facial recognizer
f_r = facial_recognition.FacialRecognizer()

# * ---------- Create App --------- *
app = Flask(__name__)
CORS(app, support_credentials=True)

# Initialize the video stream
video_stream = video.VideoStream(src=0).start()
time.sleep(2.0)

# # * ---------- DATABASE CONFIG --------- *
# DATABASE_USER = os.environ['DATABASE_USER']
# DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
# DATABASE_HOST = os.environ['DATABASE_HOST']
# DATABASE_PORT = os.environ['DATABASE_PORT']
# DATABASE_NAME = os.environ['DATABASE_NAME']


def DATABASE_CONNECTION():
    try:
        return psycopg2.connect(
            user="saroopa",
            password="",
            host="127.0.0.1",
            port="5432",
            database="facial_recognition",
            connect_timeout=3,
        )
    except Exception as e:
        print("[!] ", e)


def detect_faces():
    time.sleep(5.0)
    global output_frame, lock
    f_r.encode()

    while True:
        frame = video_stream.read()
        resized_frame = resize(frame, width=160, height=120)

        # Initialize empty list to store 640 x 480 frame - face location
        face_locations = list()

        # Unpack the resultant tuple
        resized_face_locations, face_names = f_r.detect(resized_frame)
        for entry in resized_face_locations:
            face_locations.append(tuple(map((4).__mul__, entry)))

        # Display the results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            # Draw a box around the face
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

            # Draw a label with a name below the face
            # cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(
                frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1
            )

        # acquire the lock, set the output frame, and release the lock
        with lock:
            output_frame = frame.copy()


def generate():
    # grab global references to the output frame and lock variables
    global output_frame, lock

    # loop over frames from the output stream
    while True:
        # wait until the lock is acquired
        with lock:
            # check if the output frame is available, otherwise skip the iteration of the loop
            if output_frame is None:
                continue

            # encode the frame in JPEG format
            (flag, encoded_image) = cv2.imencode(".jpg", output_frame)

            # ensure the frame was successfully encoded
            if not flag:
                continue

        # yield the output frame in the byte format
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + bytearray(encoded_image) + b"\r\n"
        )


# * -----------------------------------  ROUTES ---------------------------------------- *

# * ---------- Stream video feed from the face recognition ---------- *
@app.route("/")
def index():
    # return the rendered template
    return render_template("index.html")


# * ---------- Send video feed from the face recognition to the web ---------- *
@app.route("/video_feed")
def video_feed():
    # return the response generated along with the specific media type (mime type)
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


# * ---------- Get data from the face recognition ---------- *
@app.route("/receive_data", methods=["GET", "POST"])
def get_receive_data():
    if request.method == "POST":
        json_data = request.get_json()
        # Check if the user is already in the DB
        try:
            # Connect to the DB
            connection = DATABASE_CONNECTION()
            cursor = connection.cursor()

            # Query to check if the user as been seen by the camera today
            user_saw_today_sql_query = f"SELECT * FROM records WHERE date = '{json_data['date']}' AND name = '{json_data['name']}' AND arrival_time is not null;"

            cursor.execute(user_saw_today_sql_query)
            result = cursor.fetchall()
            connection.commit()

            # If user is already in the DB for today:
            if result:
                arrival_time_sql_query = f"SELECT arrival_time FROM records WHERE date = '{json_data['date']}' AND name = '{json_data['name']}' AND departure_time is null;"

                cursor.execute(arrival_time_sql_query)
                arrival_time = cursor.fetchall()
                connection.commit()

                if json_data["hour"] != arrival_time[0][0]:
                    print(f"{json_data['name']} OUT")
                    image_path = f"{FILE_PATH}/assets/img/departure/{json_data['date']}/{json_data['name']}.jpg"

                    # Save image
                    os.makedirs(
                        f"{FILE_PATH}/assets/img/departure/{json_data['date']}",
                        exist_ok=True,
                    )
                    cv2.imwrite(image_path, np.array(json_data["picture_array"]))
                    json_data["picture_path"] = image_path

                    # Update user in the DB
                    update_user_query = f"UPDATE records SET departure_time = '{json_data['hour']}', departure_picture = '{json_data['picture_path']}' WHERE name = '{json_data['name']}' AND date = '{json_data['date']}';"
                    cursor.execute(update_user_query)

            else:
                print(f"{json_data['name']} IN")
                # Save image
                image_path = f"{FILE_PATH}/assets/img/arrival/{json_data['date']}/{json_data['name']}.jpg"
                os.makedirs(
                    f"{FILE_PATH}/assets/img/arrival/{json_data['date']}", exist_ok=True
                )
                cv2.imwrite(image_path, np.array(json_data["picture_array"]))
                json_data["picture_path"] = image_path

                # Create a new row for the user today:
                insert_user_query = f"INSERT INTO records (name, date, arrival_time, arrival_picture) VALUES ('{json_data['name']}', '{json_data['date']}', '{json_data['hour']}', '{json_data['picture_path']}');"
                cursor.execute(insert_user_query)

        except (Exception, psycopg2.DatabaseError) as error:
            print("ERROR DB: ", error)
        finally:
            connection.commit()

            # closing database connection.
            if connection:
                cursor.close()
                connection.close()
                print("PostgreSQL connection is closed")

        # Return user's data to the front
        return jsonify(json_data)


# * ---------- Get all the data of an employee ---------- *
@app.route("/get_employee", methods=["GET"])
def get_employee():
    name = request.args.get("name", default="", type=str)
    answer_to_send = {}
    # Check if the user is already in the DB
    try:
        # Connect to DB
        connection = DATABASE_CONNECTION()
        cursor = connection.cursor()
        # Query the DB to get all the data of a user:
        user_information_sql_query = f"SELECT * FROM records WHERE name = '{name}';"

        cursor.execute(user_information_sql_query)
        result = cursor.fetchall()

        column_cursor = connection.cursor()
        schema_query = f"SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'records';"
        column_cursor.execute(schema_query)
        column_names = column_cursor.fetchall()

        connection.commit()

        # if the user exist in the db:
        if result:
            # Structure the data and put the dates in string for the front
            for idx, value in enumerate(result):
                answer_to_send[idx] = {}
                for idx_o, value_o in enumerate(value):
                    answer_to_send[idx][column_names[idx_o][0]] = str(value_o)
        else:
            answer_to_send = {"error": "User not found..."}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # closing database connection:
        if connection:
            cursor.close()
            connection.close()

    # Return the user's data to the front
    return jsonify(answer_to_send)


# * --------- Get the n last users seen by the camera --------- *
@app.route("/get_n_last_entries", methods=["GET"])
def get_5_last_entries():
    n = request.args.get("n", default=5, type=int)
    answer_to_send = {}
    # Check if the user is already in the DB
    try:
        # Connect to DB
        connection = DATABASE_CONNECTION()

        cursor = connection.cursor()
        # Query the DB to get all the data of a user:
        lasts_entries_sql_query = f"SELECT * FROM records ORDER BY id DESC LIMIT {n};"

        cursor.execute(lasts_entries_sql_query)
        result = cursor.fetchall()

        column_cursor = connection.cursor()
        schema_query = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'records'"
        column_cursor.execute(schema_query)
        column_names = column_cursor.fetchall()

        connection.commit()

        # if DB is not empty:
        if result:
            # Structure the data and put the dates in string for the front
            for idx, value in enumerate(result):
                answer_to_send[idx] = {}
                for idx_o, value_o in enumerate(value):
                    answer_to_send[idx][column_names[idx_o][0]] = str(value_o)
        else:
            answer_to_send = {"error": "error detect"}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # closing database connection:
        if connection:
            cursor.close()
            connection.close()

    # Return the user's data to the front
    return jsonify(answer_to_send)


# * ---------- Add new employee ---------- *
@app.route("/add_employee", methods=["POST"])
@cross_origin(supports_credentials=True)
def add_employee():
    answer = {}
    try:
        # Get the picture from the request
        image_file = request.files["image"]
        name_of_user = request.form["nameOfEmployee"]

        # image_file = request.args.get("image", default="")
        # name_of_user = request.args.get("nameOfEmployee", default="", type=str)

        # Store it in the folder of the know faces:
        file_path = os.path.join(f"{FILE_PATH}/assets/img/users/{name_of_user}.jpg")
        image_file.save(file_path)

        # Connect to DB
        connection = DATABASE_CONNECTION()
        cursor = connection.cursor()

        # Create a new row for the user today:
        insert_new_user_query = f"INSERT INTO users (name, photo_path) VALUES ('{name_of_user}', '{file_path}');"
        cursor.execute(insert_new_user_query)

        answer["message"] = f"New employee {name_of_user} succesfully added"
    except:
        answer[
            "message"
        ] = f"Error while adding new employee {name_of_user}. Please try later..."
    finally:
        connection.commit()

        # Closing Database Connection
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

        try:
            importlib.reload(facial_recognition)
            print("Module loaded")
            f_r.encode()
        except Exception as err:
            print(err)

    return jsonify(answer)


# * ---------- Get employee list ---------- *
@app.route("/get_employee_list", methods=["GET"])
def get_employee_list():
    answer_to_send = {}
    try:
        # Walk in the user folder to get the user list
        """ walk_count = 0
        for file_name in os.listdir(f"{FILE_PATH}/assets/img/users/"):
            # Capture the employee's name with the file's name
            name = re.findall("(.*)\.jpg", file_name)
            if name:
                employee_list[walk_count] = name[0]
            walk_count += 1 """

        # Connect to DB
        connection = DATABASE_CONNECTION()
        cursor = connection.cursor()

        column_cursor = connection.cursor()
        schema_query = f"SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users';"
        column_cursor.execute(schema_query)
        column_names = column_cursor.fetchall()

        get_employee_list_query = f"SELECT DISTINCT name, photo_path from users;"
        cursor.execute(get_employee_list_query)

        employee_list = cursor.fetchall()

        for key, value in enumerate(employee_list):
            answer_to_send[key] = {}
            for key_o, value_o in enumerate(value):
                answer_to_send[key][column_names[key_o][0]] = str(value_o)
    except:
        return f"Unable to fetch the employee list. Please try after sometime."
    finally:
        connection.commit()

        # Closing Database Connection
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

    return jsonify(answer_to_send)


# * ---------- Delete employee ---------- *
@app.route("/delete_employee", methods=["GET"])
def delete_employee():
    employee_name = request.args.get("name", default="", type=str)
    answer_to_send = {}
    does_exist = ""
    try:
        print("name: ", employee_name)
        # Connect to DB
        connection = DATABASE_CONNECTION()
        existence_cursor = connection.cursor()

        # Check if the employee_name exists in the users table
        existence = f"SELECT EXISTS (SELECT 1 FROM users WHERE name='{employee_name}');"
        existence_cursor.execute(existence)
        does_exist = existence_cursor.fetchall()

        if does_exist[0][0]:
            # Remove the picture of the employee from the user's folder:
            file_path = os.path.join(
                f"{FILE_PATH}/assets/img/users/{employee_name}.jpg"
            )
            os.remove(file_path)

            cursor = connection.cursor()

            # Delete the user row from the users table:
            delete_user_query = f"DELETE FROM users WHERE name = '{employee_name}';"
            cursor.execute(delete_user_query)

            answer_to_send["message"] = f"Employee {employee_name} succesfully removed."
        else:
            answer_to_send["message"] = f"Employee {employee_name} not found."
    except Exception as ex:
        print(ex)
        answer_to_send[
            "message"
        ] = f"Error while deleting employee {employee_name}. Please try again."
    finally:
        if does_exist[0][0] and connection:
            connection.commit()
            # Close Database connection
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
        try:
            importlib.reload(facial_recognition)
            print("Module loaded")
            f_r.encode()
        except Exception as err:
            print(err)

    return jsonify(answer_to_send)


@app.route("/run_script", methods=["GET"])
def run_script():
    answer_to_send = {}
    try:
        os.system("python facial_recognition.py")
        answer_to_send["message"] = "Script successfully executed"
    except Exception as ex:
        print(ex)
        answer_to_send["message"] = "Cannot run the script"
    finally:
        print("finished.")

    return answer_to_send


# * -------------------- RUN SERVER -------------------- *
if __name__ == "__main__":

    # start a thread that will perform face detection
    t = threading.Thread(target=detect_faces)
    t.daemon = True
    t.start()
    print("thread")

    # * --- DEBUG MODE: --- *
    app.run(host="127.0.0.1", port=5000, debug=True, threaded=True, use_reloader=False)

# release the video stream pointer
video_stream.stop()
