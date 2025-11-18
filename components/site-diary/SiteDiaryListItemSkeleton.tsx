import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonItem = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.skeleton, styles.titleSkeleton, { opacity }]} />
        </View>
        <Animated.View style={[styles.skeleton, styles.authorSkeleton, { opacity }]} />
      </View>
    </View>
  );
};

const SiteDiaryListItemSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </>
  );
};

export default SiteDiaryListItemSkeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  titleSkeleton: {
    height: 20,
    width: '70%',
  },
  authorSkeleton: {
    height: 16,
    width: '50%',
  },
});
