import sys
from rembg import remove

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 remove_bg.py input.png output.png")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, "rb") as i:
        input_data = i.read()

    output_data = remove(input_data)

    with open(output_path, "wb") as o:
        o.write(output_data)

if __name__ == "__main__":
    main()