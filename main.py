from __init__ import create_app
import os

app = create_app()


if __name__ == '__main__':
    # Get the port number from the PORT environment variable
    port = int(os.environ.get('PORT', 8080))

    # Bind to 0.0.0.0 so that the app is accessible from any IP address
    app.run(host='0.0.0.0', port=port)