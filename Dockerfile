FROM node:8

WORKDIR /usr/src/app
ADD . /usr/src/app

# Install node dependencies
RUN yarn

# Create drop-folder and video-content folder
RUN mkdir -p /usr/src/app/content/video
RUN mkdir -p /usr/src/app/content/dropfolder

# Install ffmpeg
RUN wget --quiet https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz;
RUN tar -xvf ffmpeg-release-64bit-static.tar.xz -C /opt/;
RUN rm ffmpeg-release-64bit-static.tar.xz;
RUN mv /opt/ffmpeg* /opt/ffmpeg-release-64bit-static;
RUN ln -s /opt/ffmpeg-release-64bit-static/ffmpeg /usr/bin/ffmpeg;
RUN ln -s /opt/ffmpeg-release-64bit-static/ffprobe /usr/bin/ffprobe;
