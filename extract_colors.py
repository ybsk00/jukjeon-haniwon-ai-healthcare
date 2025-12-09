import sys
from PIL import Image
from collections import Counter

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_dominant_colors(image_path, num_colors=5):
    try:
        image = Image.open(image_path)
        image = image.convert('RGB')
        image = image.resize((150, 150))  # Resize for speed
        
        # Get colors from image
        pixels = list(image.getdata())
        counts = Counter(pixels)
        common = counts.most_common(num_colors)
        
        with open('colors.txt', 'w') as f:
            f.write(f"Dominant colors in {image_path}:\n")
            for color, count in common:
                hex_color = rgb_to_hex(color)
                f.write(f"{hex_color} (RGB: {color}, Count: {count})\n")
            print("Done writing to colors.txt")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    image_path = r"C:/Users/유범석/.gemini/antigravity/brain/d47e1a91-1f62-448b-b90e-15b0c2c90de0/uploaded_image_1765269698714.png"
    get_dominant_colors(image_path)
