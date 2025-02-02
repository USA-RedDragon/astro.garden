#!/usr/bin/env python

import json
from string import Template
import logging

logging.basicConfig(level=logging.INFO)

TEMPLATE_FILE = "templates/image.md"
DEST_DIR = "./content/gallery"

def generate_image_page(title, text, src, wip=False, annotated=False):
    with open(TEMPLATE_FILE, 'r') as tf:
        template = Template(tf.read())
        result = template.substitute(title=title, text=text, src=src, wip=wip, annotated=annotated)
        with open(f"{DEST_DIR}/{src}.md", 'w') as df:
            df.write(result)

def main():
    images = None
    with open(f"data/data.json", 'r') as df:
        images = json.load(df)

    for image in images:
        generate_image_page(
            title=image["title"],
            text=image["text"],
            src=image["src"],
            wip=('wip' in image and image["wip"]),
            annotated=('annotated' in image and image["annotated"])
        )

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logging.error(e)
        exit(1)
