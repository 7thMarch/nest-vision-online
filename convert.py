
import os
import subprocess
import tensorflow as tf
import onnx
from onnx_tf.backend import prepare

def convert_onnx_to_tfjs():
    # 1. 加载 ONNX 模型
    print("Loading ONNX model...")
    onnx_model = onnx.load("birdnest.onnx")
    
    # 2. 创建临时目录用于保存中间文件
    os.makedirs("temp_saved_model", exist_ok=True)
    
    # 3. 转换 ONNX 到 TensorFlow SavedModel
    print("Converting ONNX to TensorFlow SavedModel...")
    tf_rep = prepare(onnx_model)
    tf_rep.export_graph("temp_saved_model")
    
    # 4. 创建输出目录
    os.makedirs("public/models/birdnest", exist_ok=True)
    
    # 5. 使用 tensorflowjs_converter 转换为 TensorFlow.js 格式
    print("Converting to TensorFlow.js format...")
    subprocess.run([
        "tensorflowjs_converter",
        "--input_format=tf_saved_model",
        "--output_format=tfjs_graph_model",
        "--signature_name=serving_default",
        "--saved_model_tags=serve",
        "temp_saved_model",
        "public/models/birdnest"
    ])
    
    # 6. 清理临时文件
    import shutil
    shutil.rmtree("temp_saved_model", ignore_errors=True)
    
    print("Conversion complete! Files are in public/models/birdnest/")

if __name__ == "__main__":
    # 检查必要的库是否已安装
    try:
        import onnx
        import onnx_tf
        import tensorflow as tf
    except ImportError as e:
        print(f"Missing required package: {e}")
        print("Please install required packages:")
        print("pip install onnx onnx-tf tensorflow tensorflowjs")
        exit(1)
        
    convert_onnx_to_tfjs()
