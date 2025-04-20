
# Bird Nest Detection Model

Place your converted ONNX model files here:
- model.json
- group1-shard1of1.bin

The model should be converted from YOLOv8 to TensorFlow.js format using the following steps:

1. Convert YOLOv8 to ONNX:
```python
from ultralytics import YOLO
model = YOLO('birdnest.pt')
model.export(format='onnx')
```

2. Convert ONNX to TensorFlow.js:
```bash
tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_format=tfjs_graph_model \
  --signature_name=serving_default \
  --saved_model_tags=serve \
  birdnest.onnx \
  ./public/models/birdnest
```
