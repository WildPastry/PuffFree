/* eslint-disable no-console */
import { ColorSchemeName, Platform, Pressable, StyleSheet } from 'react-native';
import ForwardedScrollView, { Text, View } from '../components/styles/Themed';
import React, { useEffect, useRef } from 'react';

import Colours from '../constants/colours';
import ExternalLink from '../components/features/ExternalLink';
import { FontAwesome } from '@expo/vector-icons';
import { FontDisplay } from '../components/styles/StyledText';
import { StatusBar } from 'expo-status-bar';
import packageJson from '../../package.json';
import useColorScheme from '../hooks/useColorScheme';
import { useIsFocused } from '@react-navigation/native';

const About: React.FC = (): JSX.Element => {
  // Screen settings
  const scrollViewRef: React.MutableRefObject<any> = useRef<any>(null);
  const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
  const isFocused = useIsFocused();

  const handleFeedback = (): void => {
    console.log('SUGGESTIONS');
  };

  const getAppVersion = (): string => {
    return packageJson.version.toString();
  };

  // Scroll to top function
  const scrollTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: false });
  };

  // Scroll to top on focus
  useEffect(() => {
    if (isFocused) {
      scrollTop();
    }
  }, [isFocused]);

  return (
    <ForwardedScrollView
      contentContainerStyle={styles.container}
      ref={scrollViewRef}>
      {/* Logo */}
      <FontAwesome
        style={styles.icon}
        name='info-circle'
        size={50}
        color={Colours[colorScheme].text}
      />
      {/* Title */}
      <FontDisplay style={styles.title}>About the app</FontDisplay>
      <Text style={styles.versionText}>
        JustForToday app version {getAppVersion()}
      </Text>
      {/* Divider */}
      <View
        style={styles.divider}
        lightColor={Colours[colorScheme].seperator}
        darkColor={Colours[colorScheme].seperator}
      />
      <Text style={styles.text}>
        Daily reflections, steps, and tradtions with zero advertisments.
      </Text>
      <Text style={styles.text}>
        Created to give people in the fellowship fast access to well known AA
        literature at the touch of a button.
      </Text>
      <Text style={styles.subTitle}>Questions?</Text>
      <Text style={styles.text}>
        Questions, concerns and feedback can be sent to the team using the
        button below.
      </Text>
      {/* Suggestions button */}
      <Pressable style={styles.btn} onPress={() => handleFeedback()}>
        <FontDisplay style={styles.textCenter}>Send feedback</FontDisplay>
      </Pressable>
      {/* Divider */}
      <View
        style={styles.divider}
        lightColor={Colours[colorScheme].seperator}
        darkColor={Colours[colorScheme].seperator}
      />
      <Text style={styles.text}>
        All literature is taken with permission from{' '}
        <ExternalLink style={styles.helpLink} href='https://www.aa.org/'>
          <Text
            style={styles.helpLinkText}
            lightColor={Colours.light.link}
            darkColor={Colours.light.link}>
            Alcoholics Anonymous World Services, Inc.
          </Text>
        </ExternalLink>
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ForwardedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10
  },
  text: {
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 10
  },
  textCenter: {
    color: 'white',
    textAlign: 'center'
  },
  versionText: {
    textAlign: 'center',
    lineHeight: 20
  },
  btn: {
    backgroundColor: '#131324',
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 12
  },
  icon: {
    marginBottom: 10,
    textAlign: 'center'
  },
  divider: {
    alignSelf: 'center',
    marginVertical: 20,
    height: 1,
    width: '70%'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    textAlign: 'center'
  }
});

export default About;
