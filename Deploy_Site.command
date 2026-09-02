#!/bin/bash

# Navigate to the directory where this script is located
cd "$(dirname "$0")"

echo "======================================"
echo "🚀 Starting Deployment Process..."
echo "======================================"
echo ""

echo "🔄 Step 1: Rebuilding Website HTML..."
python3 generate_job_boards.py
python3 update_nav_footer.py
echo "✅ Website built successfully."
echo ""

echo "☁️ Step 2: Saving to GitHub..."
git add .
git commit -m "chore: one-click content update"
git push
echo "✅ Code saved to GitHub."
echo ""

echo "🔥 Step 3: Deploying live to Firebase..."
npx -y firebase-tools@latest deploy
echo "✅ Deployment complete!"
echo ""

echo "======================================"
echo "🎉 ALL DONE! Your site is now live."
echo "======================================"
echo "This window will automatically close in 10 seconds..."
sleep 10
