/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { buildHTML } from './iFrame';
import { Images } from './assets';

const YoutubePlayer = ({ videoId }) => {
  const webRef = useRef(null);
  const [time, setTime] = useState('00:00');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [webViewHasLoadedContent, setWebViewHasLoadedContent] = useState(false);
  const playVideo = () => {
    setPlaying(true);
    webRef.current?.injectJavaScript('play()');
  };

  const pauseVideo = () => {
    setPlaying(false);
    webRef.current?.injectJavaScript('pause()');
  };

  const restartVideo = () => {
    webRef.current?.injectJavaScript('seekTo(0)');
  };

  const onMessageRecieved = (message) => {
    const responseJSON = JSON.parse(message.nativeEvent.data);
    const minutes = Math.round(responseJSON.currentDuration / 60);
    const seconds = Math.round(responseJSON.currentDuration % 60);
    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    const secondsText = seconds < 10 ? `0${seconds}` : seconds;
    setTime(`${minutesText}:${secondsText}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <WebView
          ref={webRef}
          source={{ html: buildHTML(videoId) }}
          allowsFullscreenVideo={false}
          allowsInlineMediaPlayback
          scalesPageToFit={false}
          onMessage={onMessageRecieved}
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState={true}
          onLoad={() => setLoading(false)}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={'white'}
              style={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 95,
              }}
            />
          )}
          onLoadStart={(event) => {
            setTimeout(() => {
              setWebViewHasLoadedContent(true);
            }, 500);
          }}
          style={{ opacity: webViewHasLoadedContent ? 1 : 0 }}
        />
        {loading ? null : (
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              opacity: 0.1,
            }}
          />
        )}
      </View>
      <View style={styles.buttonRow}>
        {!playing ? (
          <TouchableOpacity activeOpacity={1} onPress={playVideo}>
            <Image source={Images.play} style={{ height: 50, width: 49 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={pauseVideo}>
            <Image source={Images.pause} style={{ height: 50, width: 49 }} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  videoContainer: {
    height: 200,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  buttonRow: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default YoutubePlayer;
