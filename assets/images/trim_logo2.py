import sys
try:
    from PIL import Image, ImageChops
    print("PIL imported successfully")
except ImportError:
    print("PIL not found")
    sys.exit(1)

try:
    im = Image.open('logo.png').convert('RGB')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    
    if bbox:
        im_trimmed = im.crop(bbox)
        padding = 10
        new_size = (im_trimmed.width + padding*2, im_trimmed.height + padding*2)
        final_im = Image.new('RGB', new_size, (255, 255, 255))
        final_im.paste(im_trimmed, (padding, padding))
        final_im.save('logo_cropped.png')
        print(f"Trimmed to {final_im.size}")
    else:
        print("Empty bounding box")
except Exception as e:
    import traceback
    traceback.print_exc()
