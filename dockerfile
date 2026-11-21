FROM python:3.12-slim-bookworm

ENV PORT=3000 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    WEB_ROOT=/srv/site

WORKDIR /app
COPY server.py /app/server.py
COPY index.html style.css theme.js portfolio-mark.png /srv/site/

EXPOSE 3000
USER 10001:10001
CMD ["python3", "/app/server.py"]
