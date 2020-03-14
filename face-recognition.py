# Import the library
import numpy as np
import face_recognition
import os
import re
import cv2
import requests
import time

# * ---------- Encode all the known pictures ---------- *
def encode_known():
    # Declare all the list
    known_face_encodings = []
    known_face_names = []
    known_faces_filenames = []

    # Walk in the folder to add every file name to known_faces_filenames
    for (dirpath, dirnames, filenames) in os.walk('assets/img/users/'):
        known_faces_filenames.extend(filenames)
        break

    # Walk in the folder
    for filename in known_faces_filenames:
        # Load each file
        face = face_recognition.load_image_file('assets/img/users/' + filename)
        # Extract the name of each employee and add it to known_face_names
        known_face_names.append(re.sub("[0-9]",'', filename[:-4]))
        # Encode the face of every employee
        try:
            known_face_encodings.append(face_recognition.face_encodings(face)[0])
        except IndexError:
            print(f'Error encoding this file {filename}')
            pass
    return known_face_encodings, known_face_names

# * --------- Apply to Every frame of the Video Feed --------- *
def detect_nameless(known_face_encodings, known_face_names):
    # Select the webcam of the computer (0 by default for laptop)
    video_capture = cv2.VideoCapture(0)

    # Apply it until you stop the file's execution
    while True:
        # Take every frame
        frame = video_capture.read()
        # Process every frame only one time
        if frame:
            face_locations = []
            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(frame)
            face_encodings = face_recognition.face_encodings(frame, face_locations)
            # Initialize an array for the name of the detected users
            face_names = []
            # * ---------- Initialize JSON to EXPORT --------- *
            json_to_export = {}
            print(face_encodings)
            # Loop in every faces detected
            for face_encoding in face_encodings:
                print(4)
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                print(5)
                # check the known face with the smallest distance to the new face
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                # Take the best one
                best_match_index = np.argmin(face_distances)
                # If we have a match
                if matches[best_match_index]:
                    print(6)
                    # Save the name of the best match
                    name = known_face_names[best_match_index]

                    # * ---------- SAVE data to send to the API -------- *
                    # Save the name
                    json_to_export['name'] = name
                    # Save the time
                    json_to_export['hour'] = f'{time.localtime().tm_hour}:{time.localtime().tm_min}'
                    # Save the date
                    json_to_export[
                        'date'] = f'{time.localtime().tm_year}-{time.localtime().tm_mon}-{time.localtime().tm_mday}'
                    # If you need to save a screenshot:
                    json_to_export['picture_array'] = frame.tolist()

                    # * ---------- SEND data to API --------- *
                    # Make a POST request to the API
                    r = requests.post(url='http://127.0.0.1:5000/receive_data', json=json_to_export)
                    # Print to status of the request:
                    print("Status: ", r.status_code)
            print(7)
            # Store the name in an array to display it later
            face_names.append(name)
            # To be sure that we process every frame only one time
            process_this_frame = not process_this_frame

            # * --------- Display the results ---------- *
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                # Define the font of the name
                font = cv2.FONT_HERSHEY_DUPLEX
                # Display the name
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            # Display the resulting image
            cv2.imshow('Video', frame)

    # Release handle to the webcam
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    encoded_values = encode_known()
    known_face_encodings, known_face_names = encoded_values
    response = input("Do you want to encode unknown 'y' or 'n'?")
    detect_nameless(known_face_encodings, known_face_names) if response == 'y' else print('Thanks!')
