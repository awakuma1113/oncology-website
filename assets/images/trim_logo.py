import sys
try:
    from PIL import Image, ImageChops
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        # Check if the image has two disjoint parts by scanning horizontally/vertically?
        # For simplicity, let's just use the bounding box.
        return im.crop(bbox)
    return im

try:
    im = Image.open('logo.png')
    # Convert to RGB if it has alpha channel, or just use as is for difference
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        im = im.convert('RGBA')
        # Create a white background
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        im = bg.convert('RGB')
    else:
        im = im.convert('RGB')

    im_trimmed = trim(im)
    
    # Let's add a small padding (e.g. 20px)
    padding = 20
    new_size = (im_trimmed.width + padding*2, im_trimmed.height + padding*2)
    final_im = Image.new('RGBA', new_size, (255, 255, 255, 0)) # transparent background
    
    # Paste the trimmed image (with white background removed where possible, or just keep white for now)
    # Actually, let's just keep the white background and add padding
    final_im = Image.new('RGB', new_size, (255, 255, 255))
    final_im.paste(im_trimmed, (padding, padding))
    
    final_im.save('logo_cropped.png')
    print(f"Original size: {im.size}, Trimmed size: {final_im.size}")
except Exception as e:
    print(f"Error: {e}")
