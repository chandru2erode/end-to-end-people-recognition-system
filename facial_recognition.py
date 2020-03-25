""" Facial Recognition script for detecting faces and recognize the known faces with labels """
# Required Library Imports
import os
import re
import time
import requests
import face_recognition
import numpy as np


# bufferless VideoCapture
class FacialRecognizer:
    """ This class opens camera and reads the frames.
        It keeps only most recent one for bufferless capturing """

    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_faces_filenames = []


    def detect(self, frame):
        # global known_face_encodings, known_face_names

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
            # matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            # Using the known face with the smallest distance with threshold to the new face
            face_distances = face_recognition.face_distance(
                self.known_face_encodings, face_encoding
            )
            best_match_index = np.argmin(face_distances)

            if face_distances[best_match_index] < 0.5:
                name = self.known_face_names[best_match_index]

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


    def encode(self):
        for (dirpath, dirnames, filenames) in os.walk("assets/img/users/"):
            self.known_faces_filenames.extend(filenames)
            break

        for filename in self.known_faces_filenames:
            face = face_recognition.load_image_file("assets/img/users/" + filename)
            self.known_face_names.append(re.sub("[0-9]", "", filename[:-4]))
            try:
                self.known_face_encodings.append(face_recognition.face_encodings(face)[0])
            except IndexError:
                print(f"Error encoding this file - {filename}")
