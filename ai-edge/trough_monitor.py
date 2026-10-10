import cv2
import time
import requests
from ultralytics import YOLO

# Load lightweight YOLO model
model = YOLO('yolov8n.pt') 

RTSP_URL = "rtsp://admin:admin@192.168.1.100:554/stream"
BACKEND_ALERT_URL = "http://localhost:3000/api/ai/feed-alert"
GAUSHALA_ID = 1

# Define Feed Trough Regions of Interest (ROI) - Polygons
TROUGH_ROI = [(100, 400), (500, 400), (450, 600), (50, 600)]

def check_fodder_status(frame):
    # Run YOLO detection
    results = model(frame, verbose=False)
    
    fodder_detected = False
    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            class_name = model.names[cls_id]
            # TODO: Replace with custom trained model for "fodder" and "empty_trough"
            # For demonstration purposes, if using standard COCO model, mapping 'potted plant' (index 58)
            # or 'backpack' (index 24) to mock fodder detection.
            if class_name in ['potted plant', 'backpack', 'fodder', 'hay']:
                fodder_detected = True
                break
    return fodder_detected

def main():
    cap = cv2.VideoCapture(RTSP_URL)
    empty_trough_startTime = None
    
    # 30 minutes threshold for Empty Trough Alert
    MAX_EMPTY_DURATION = 30 * 60 

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame. Reconnecting...")
            time.sleep(5)
            cap = cv2.VideoCapture(RTSP_URL)
            continue

        has_fodder = check_fodder_status(frame)

        if not has_fodder:
            if empty_trough_startTime is None:
                empty_trough_startTime = time.time()
            else:
                elapsed = time.time() - empty_trough_startTime
                if elapsed > MAX_EMPTY_DURATION:
                    print("🚨 FEED DELAY ALERT! Trough is empty for >30 mins.")
                    requests.post(BACKEND_ALERT_URL, json={
                        "gaushala_id": GAUSHALA_ID,
                        "type": "FEED_DELAY",
                        "description": "Feed trough detected empty during scheduled hours."
                    })
                    # Reset timer to avoid spam
                    empty_trough_startTime = None 
        else:
            # Fodder is present, reset timer
            empty_trough_startTime = None

        time.sleep(10) # Run inference every 10 seconds to save edge compute

if __name__ == "__main__":
    main()
