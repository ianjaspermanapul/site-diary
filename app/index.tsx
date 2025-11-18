import { Stack, useRouter } from 'expo-router';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Container } from '@/components/Container';
import SiteDiaryListItem from '@/components/site-diary/SiteDiaryListItem';
import SiteDiaryListItemSkeleton from '@/components/site-diary/SiteDiaryListItemSkeleton';
import { SiteDiary } from './api/graphql+api';
import { useSiteDiaries } from '@/hooks/site-diary/useSiteDiaries';

export default function Home() {
  const router = useRouter();
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/site-diary/create')}
        activeOpacity={0.8}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android shadow
    elevation: 8,
  },
});
