import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

interface Props {
  uri: string;
}

export const AttachmentThumbnail = ({ uri }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
