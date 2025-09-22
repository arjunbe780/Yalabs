🎙 React Native Audio Recorder
A simple Audio Recorder built with React Native.
It supports recording, pausing, resuming, saving, listing, playing, and deleting audio files.

📦 Installation
1. Install Node.js and npm
	• Download and install Node.js from https://nodejs.org
	• npm (Node Package Manager) is included with Node.js
	• Verify installation:
		○ node -v
		○ npm -v
2. Install React Native CLI
npm install -g react-native-cli
3. Create a new React Native project
npx react-native init AudioRecorderApp
4. Navigate to the project folder
cd AudioRecorderApp
5. Install required dependencies
npm install react-native-nitro-sound react-native-blob-util react-native-permissions react-native-paper
or with yarn:
yarn add react-native-nitro-sound react-native-blob-util react-native-permissions react-native-paper

⚙️ Permissions
	• Android → Requires microphone and storage permissions.
	• iOS → Requires microphone permission.

🚀 Usage
	• Start a new recording.
	• Pause an ongoing recording.
	• Resume a paused recording.
	• Stop and save the recording to device storage.
	• View saved recordings in a list.
	• Play and pause recordings from the list.
	• Delete unwanted recordings.

📂 Files
	• AudioRecorder → Handles recording logic (start, pause, resume, stop, save).
	• Dashboard → Displays saved recordings with play, pause, and delete options.

✅ Features
	• Record audio with pause and resume support.
	• Save recordings with unique file names.
	• Show recordings in a clean list view.
	• Play or pause recordings directly from the list.
	• Delete recordings from device storage.

🚀 Getting Started
	1. Clone or create the project on your local machine.
	2. Install dependencies using npm or yarn.
	3. Run the app:
		○ npx react-native run-android (for Android)
		○ npx react-native run-ios (for iOS)
	4. Grant microphone and storage permissions when prompted.
	5. Start recording and manage your saved audio files from the app.
