import { Button, View } from 'react-native';
import React from 'react';
import Share from 'react-native-share';

const ShareComponent = () => {
  const shareMessage = async () => {
    const options = {
      message: 'Check out this awesome content!',
      url: 'https://www.example.com'
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  return (
    <View>
      <Button title='Share' onPress={shareMessage} />
    </View>
  );
};

export default ShareComponent;
