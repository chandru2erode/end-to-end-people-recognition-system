""" Facial Recognition script for detecting faces and recognize the known faces with labels """
# Required Library Imports
import os
import re

# import threading
import time

# import queue
import requests

# import cv2
import face_recognition
import numpy as np


# bufferless VideoCapture
class FacialRecognizer:
    """ This class opens camera and reads the frames.
        It keeps only most recent one for bufferless capturing """

    def __init__(self):
        pass
        # self.cap = cv2.VideoCapture(webcam_name)
        # self.que = queue.Queue()
        # thread = threading.Thread(target=self._reader)
        # thread.daemon = True
        # thread.start()

    # # read frames as soon as they are available, keeping only most recent one
    # def _reader(self):
    #     while True:
    #         ret, current_frame = self.cap.read()
    #         if not ret:
    #             break
    #         if not self.que.empty():
    #             try:
    #                 self.que.get_nowait()   # discard previous (unprocessed) frame
    #             except queue.Empty:
    #                 pass
    #         self.que.put(current_frame)

    # # release handle to the webcam
    # def release(self):
    #     """ Releases the software and hardware sources of webcam. """
    #     self.cap.release()

    # def read(self):
    #     """ Read each frame in the queue. """
    #     return self.que.get()

    def detect(self, frame):
        global KNOWN_FACE_ENCODINGS, KNOWN_FACE_NAMES

        face_locations = []
        face_encodings = []

        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)

        # Initialize an array for the name of the detected users
        face_names = []

        # * ---------- Initialyse JSON to EXPORT --------- *
        json_to_export = {}
        for face_encoding in face_encodings:

            # See if the face is a match for the known face(s)
            # matches = face_recognition.compare_faces(KNOWN_FACE_ENCODINGS, face_encoding)
            name = "Unknown"

            # # If a match was found in known_FACE_ENCODINGS, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = KNOWN_FACE_NAMES[first_match_index]

            # Using the known face with the smallest distance with threshold to the new face
            face_distances = face_recognition.face_distance(
                KNOWN_FACE_ENCODINGS, face_encoding
            )
            best_match_index = np.argmin(face_distances)

            if face_distances[best_match_index] < 0.5:
                name = KNOWN_FACE_NAMES[best_match_index]

                # * ---------- SAVE data to send to the API -------- *
                json_to_export["name"] = name
                json_to_export[
                    "hour"
                ] = f"{time.localtime().tm_hour}:{time.localtime().tm_min}"
                json_to_export[
                    "date"
                ] = f"{time.localtime().tm_year}-{time.localtime().tm_mon}-{time.localtime().tm_mday}"
                json_to_export["picture_array"] = frame.tolist()
                # * ---------- SEND data to API --------- *
                request = requests.post(
                    url="http://127.0.0.1:5000/receive_data", json=json_to_export
                )
                print("Status: ", request.status_code)

            face_names.append(name)
        return face_locations, face_names
        # PROCESS_THIS_FRAME = not PROCESS_THIS_FRAME


# Select the webcam of the computer
## VIDEO_CAPTURE = VideoCapture(0)

# VIDEO_CAPTURE.set(5,1)

# * -------------------- USERS -------------------- *
KNOWN_FACE_ENCODINGS = []
KNOWN_FACE_NAMES = []
KNOWN_FACES_FILENAMES = []

for (dirpath, dirnames, filenames) in os.walk("assets/img/users/"):
    KNOWN_FACES_FILENAMES.extend(filenames)
    break

for filename in KNOWN_FACES_FILENAMES:
    face = face_recognition.load_image_file("assets/img/users/" + filename)
    KNOWN_FACE_NAMES.append(re.sub("[0-9]", "", filename[:-4]))
    try:
        KNOWN_FACE_ENCODINGS.append(face_recognition.face_encodings(face)[0])
    except IndexError:
        print(f"Error encoding this file - {filename}")


# while True:
#     # for i in range(5):
#     #     VIDEO_CAPTURE.grab()

#     # Grab a single frame of video
#     FRAME = VIDEO_CAPTURE.read()

# # Hit 'q' on the keyboard to quit!
# if cv2.waitKey(1) & 0xFF == ord('q'):
#     break

# Release handle to the webcam
# VIDEO_CAPTURE.release()
# cv2.destroyAllWindows()
