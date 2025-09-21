import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  RefreshControl,
} from 'react-native';
import BlobUtil from 'react-native-blob-util';
import Sound, { useSound } from 'react-native-nitro-sound';
import { IconButton, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioList } from '../redux/slice/AppSlice';

const audioExtensions = ['.mp3', '.m4a', '.aac', '.wav', '.mp4'];

const Dashboard = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { startPlayer, stopPlayer } = useSound({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dispatch = useDispatch() as any;
  const { audioList } = useSelector((state: any) => state.app);
  useEffect(() => {
    (async () => {
      const granted = await getPermission();
      if (granted) {
        scanStorage();
      }
    })();
  }, []);

  const getAllAudioFiles = async (
    dirPath: string,
    filesList: { id: string; path: string; name: string }[] = [],
  ) => {
    try {
      const items = await BlobUtil.fs.ls(dirPath);

      for (const item of items) {
        const fullPath = `${dirPath}/${item}`;
        const isDir = await BlobUtil.fs.isDir(fullPath);

        if (isDir) {
          await getAllAudioFiles(fullPath, filesList);
        } else {
          if (audioExtensions.some(ext => fullPath.endsWith(ext))) {
            filesList.push({
              id: fullPath, // unique identifier
              path: fullPath,
              name: item, // just the file name
            });
          }
        }
      }
    } catch (err) {
      console.log('Error scanning:', dirPath, err);
    }

    return filesList;
  };

  const scanStorage = async () => {
    const root = BlobUtil.fs.dirs.SDCardDir;
    const allAudio = await getAllAudioFiles(root);
    setAudioList(allAudio);
    dispatch(setAudioList(allAudio));
  };

  async function getPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      {
        title: 'Audio Permission',
        message: 'This app needs access to your audio files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const togglePlay = async (item: { id: string; path: string }) => {
    if (playingId === item.id) {
      // stop
      stopPlayer();
      setPlayingId(null);
    } else {
      // play
      await startPlayer(item.path);
      setPlayingId(item.id);
    }
  };

  const deleteAudio = async (item: any) => {
    try {
      await BlobUtil.fs.unlink(item.path);
      const updateList = audioList.filter((f: any) => f.id !== item.id);
      dispatch(setAudioList(updateList));
      setSnackbarVisible(true);
      stopPlayer();
      setPlayingId(null);
      setSnackbarMessage('Recording deleted');
    } catch (err) {
      setSnackbarVisible(true);
      setSnackbarMessage('Unable to delete recording');
    }
  };
  const renderItem = ({
    item,
  }: {
    item: { id: string; path: string; name: string };
  }) => (
    <View style={styles.card}>
      <Text style={styles.fileName}>{item.name}</Text>
      <TouchableOpacity onPress={() => togglePlay(item)}>
        <IconButton
          icon={playingId === item.id ? 'pause-circle' : 'play-circle'}
          size={36}
          iconColor={playingId === item.id ? '#e91e63' : '#4caf50'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          deleteAudio(item);
        }}
      >
        <IconButton icon="delete" size={28} iconColor="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎙 Saved Recordings</Text>

      {audioList.length === 0 ? (
        <Text style={styles.emptyText}>No recordings found</Text>
      ) : (
        <FlatList
          data={audioList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={scanStorage}
              tintColor="#4caf50"
            />
          }
        />
      )}
      <Snackbar
        visible={snackbarVisible}
         onDismiss={() => setSnackbarVisible(false)} 
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setSnackbarVisible(false);
            // Do something
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 5,
    marginVertical: 6,
    marginHorizontal: 5,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
});

export default Dashboard;
