import { Stack } from 'expo-router';
import { FlatList, ListRenderItemInfo, StyleSheet, View, Text, ScrollView } from 'react-native';

import { Container } from '@/components/Container';
import SiteDiaryListItem from '@/components/site-diary/SiteDiaryListItem';
import SiteDiaryListItemSkeleton from '@/components/site-diary/SiteDiaryListItemSkeleton';
import { SiteDiary } from './api/graphql+api';
import { useSiteDiaries } from '@/hooks/site-diary/useSiteDiaries';

export default function Home() {
  const { siteDiaries, loading, error } = useSiteDiaries();

  const renderItem = ({ item }: ListRenderItemInfo<SiteDiary>) => {
    return <SiteDiaryListItem details={item} />;
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Site Diaries' }} />
        <Container>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Site Diaries',
          headerStyle: { backgroundColor: '#F2F2F2' },
        }}
      />
      <View style={styles.content}>
        {loading ? (
          <SiteDiaryListItemSkeleton />
        ) : (
          <FlatList
            data={siteDiaries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
});
