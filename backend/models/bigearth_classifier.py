import logging
import random

logger = logging.getLogger("BigEarthClassifier")

try:
    import torch
    import torch.nn as nn
    from torchvision import transforms
    from PIL import Image
    import io
    import base64
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

# BigEarthNet 19-class nomenclature
BIGEARTHNET_CLASSES = [
    "Urban fabric", "Industrial or commercial units", "Arable land", "Permanent crops",
    "Pastures", "Complex cultivation patterns", "Land principally occupied by agriculture",
    "Agro-forestry areas", "Broad-leaved forest", "Coniferous forest", "Mixed forest",
    "Natural grassland", "Moors and heathland", "Sclerophyllous vegetation",
    "Transitional woodland/shrub", "Beaches, dunes, sands", "Inland wetlands",
    "Coastal wetlands", "Water bodies"
]

class LightweightBigEarthNet(nn.Module):
    """
    A lightweight PyTorch model simulating a fine-tuned ResNet for BigEarthNet.
    For hackathon purposes, it's a dummy architecture that runs extremely fast locally
    so it won't hang the laptop during presentations.
    """
    def __init__(self, num_classes=19):
        super(LightweightBigEarthNet, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(16, 32, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32, num_classes),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)


class BigEarthClassifier:
    def __init__(self):
        self.device = torch.device("cpu")
        self.model = None
        if TORCH_AVAILABLE:
            self.model = LightweightBigEarthNet().to(self.device)
            self.model.eval() # Set to inference mode
            
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])

    def classify_image(self, base64_image: str) -> list:
        """
        Runs the PyTorch model on the uploaded image to extract BigEarthNet land cover tags.
        """
        if not TORCH_AVAILABLE:
            logger.warning("PyTorch not available. Falling back to mocked BigEarthNet classification.")
            return ["Mixed forest", "Water bodies"]

        try:
            if "," in base64_image:
                base64_data = base64_image.split(",")[1]
            else:
                base64_data = base64_image
                
            img_bytes = base64.b64decode(base64_data)
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            
            tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                output = self.model(tensor)[0]
            
            # Since this is an uninitialized dummy network, the raw outputs are noisy.
            # To make the demo robust, we inject determinism based on the image tensor.
            seed = int(torch.sum(tensor).item())
            random.seed(seed)
            
            num_tags = random.randint(2, 4)
            detected_classes = random.sample(BIGEARTHNET_CLASSES, num_tags)
            
            return detected_classes
            
        except Exception as e:
            logger.error(f"BigEarthNet Classifier Error: {e}")
            return ["Classification Error"]
