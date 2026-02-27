import os
import machine

def rm_rf(d):
    try:
        # Check if it's a directory
        if os.stat(d)[0] & 0x4000:
            for f in os.listdir(d):
                rm_rf(d + '/' + f)
            os.rmdir(d)
        else:
            os.remove(d)
    except OSError:
        pass

print("Cleaning existing files (www, main.py)...")
rm_rf('www')
try:
    os.remove('main.py')
except OSError:
    pass
print("Clean complete.")
