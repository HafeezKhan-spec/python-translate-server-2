# Use a base image with Node.js and Python
FROM node:18-bullseye as builder

WORKDIR /app

# Install Python
RUN apt-get update && apt-get install -y python3-pip

# Copy all project files
COPY . .

# Install Python and Node dependencies
RUN pip3 install -r requirements.txt
RUN npm install
RUN npm run build

# Final image with only Python (for smaller size)
FROM python:3.10-slim

WORKDIR /app

# Copy from builder image
COPY --from=builder /app /app

# Install Python dependencies again (lightweight)
RUN pip install -r requirements.txt

EXPOSE 8000

# Start FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
