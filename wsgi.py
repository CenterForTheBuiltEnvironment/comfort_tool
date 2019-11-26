# from comfort import app
#
# # activate_this = '/src/comfort_tool/venv/bin/activate_this.py'
# # execfile(activate_this, dict(__file__=activate_this))
#
# if __name__ == "__main__":
#     application.run()

import os
from comfort import app

if __name__=="__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
