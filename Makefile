.PHONY: all install clean

UUID     := $(shell jq -r .uuid metadata.json)
VERSION  := $(shell jq .version metadata.json)
ZIP_NAME := $(UUID).shell-extension.zip

all: $(ZIP_NAME)

$(ZIP_NAME):
	rm -f schemas/gschemas.compiled
	glib-compile-schemas ./schemas
	zip -r $(ZIP_NAME) metadata.json icons/ schemas/ prefs.js extension.js

install:
	gnome-extensions install -f $(ZIP_NAME)

clean:
	rm -f $(ZIP_NAME)
