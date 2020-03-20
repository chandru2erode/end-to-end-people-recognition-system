# End-to-End - People Recognition System

**Python version:** `Python 3.7.4`

## How to use it

There are two components in the backend: `app.py` and `facial_recgnition.py`.

* **app.py:** This is the API itself, it handle routes. You can run it with:
```bash
$ python3 app.py 
```
(or)
```bash
$ python app.py
```

* **facial_recognition.py:** This is the algorithm that read the video feed and apply face recognition. You can run it with:
```bash
$ python3 facial_recognition.py
```
(or)
```bash
$ python facial_recognition.py
```
By default it will select the camera of your computer, but you can change it by any video feed, just change the value of `video_capture = VideoCapture(0)` 0 is the prinary webcam of your computer. You can also add multiple feeds.