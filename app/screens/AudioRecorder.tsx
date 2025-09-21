import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  Button,
} from 'react-native';
import Sound, { RecordBackType, useSound } from 'react-native-nitro-sound';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BlobUtil from 'react-native-blob-util';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioList } from '../redux/slice/AppSlice';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { startPlayer, stopPlayer, mmssss } = useSound({
    subscriptionDuration: 0.05, // 50ms updates
  });

  const { audioList } = useSelector((state: any) => state.app);
  const dispatch = useDispatch() as any;
  // ✅ Microphone permission
  const getMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Recording Permission',
            message:
              'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  // ✅ Start Recording
  const onStartRecord = async () => {
    const hasPermission = await getMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone access is required.');
      return;
    }
    try {
      Sound.addRecordBackListener((e: RecordBackType) => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });

      const result = await Sound.startRecorder();
      setFilePath(result);
      setIsRecording(true);
      setIsPaused(false);

      console.log('Recording started:', result);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // ✅ Pause Recording
  const onPauseRecord = async () => {
    try {
      await Sound.pauseRecorder();
      setIsPaused(true);
      setSnackbarVisible(true);
      setSnackbarMessage('Recording paused');
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  // ✅ Resume Recording
  const onResumeRecord = async () => {
    try {
      await Sound.resumeRecorder();
      setIsPaused(false);
      setSnackbarVisible(true);
      setSnackbarMessage('Recording resumed');
    } catch (error) {
      console.error('Failed to resume recording:', error);
    }
  };

  // ✅ Stop Recording
  const onStopRecord = async () => {
    try {
      const result = await Sound.stopRecorder(); 
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setIsPaused(false);
      const destPath =
        Platform.OS === 'android'
          ? `${BlobUtil.fs.dirs.SDCardDir}/rec_${Date.now()}.mp4`
          : `${BlobUtil.fs.dirs.SDCardDir}/rec_${Date.now()}.m4a`;
      await BlobUtil.fs.cp(result, destPath); 
      dispatch(
        setAudioList([
          ...audioList,
          { id: Date.now(), path: destPath, name: `rec_${Date.now()}.mp4` },
        ]),
      );
      setRecordTime('00:00:00');
      setFilePath(destPath);
      setSnackbarVisible(true);
      setSnackbarMessage('Recording saved');
    } catch (error) {
      console.error('Failed to stop/save recording:', error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.heading}>🎤Audio Recorder</Text>
      <View style={styles.container}>
        <Text style={styles.timer}>{recordTime}</Text>
        {!isRecording ? (
          <TouchableOpacity style={styles.btnStart} onPress={onStartRecord}>
            <Text style={styles.btnText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.row}>
            {!isPaused ? (
              <TouchableOpacity style={styles.btnPause} onPress={onPauseRecord}>
                <Text style={styles.btnText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btnResume}
                onPress={onResumeRecord}
              >
                <Text style={styles.btnText}>Resume</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.btnStop} onPress={onStopRecord}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  timer: { fontSize: 32, marginBottom: 30, fontWeight: 'bold', color: '#333' },
  row: { flexDirection: 'row', gap: 20 },
  btnStart: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnPause: { backgroundColor: 'orange', padding: 15, borderRadius: 8 },
  btnResume: { backgroundColor: 'green', padding: 15, borderRadius: 8 },
  btnStop: { backgroundColor: 'red', padding: 15, borderRadius: 8 },
  btnPlay: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
