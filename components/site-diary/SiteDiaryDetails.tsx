import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SiteDiary } from '@/app/api/graphql+api';
import { formatDateString } from '@/lib/utils/date';
import { WeatherCard } from './WeatherCard';
import { AttendeeCard } from './AttendeeCard';
import { AttachmentThumbnail } from './AttachmentThumbnail';
import CustomText from '../ui/CustomText';

interface Props {
  siteDiary: SiteDiary;
}

export const SiteDiaryDetails = ({ siteDiary }: Props) => {
  const formattedDate = formatDateString(siteDiary.date, 'D MMMM YYYY');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Title and Date */}
        <View style={styles.header}>
          <CustomText variant="title" style={styles.title}>
            {siteDiary.title}
          </CustomText>
          <CustomText variant="secondary">{formattedDate}</CustomText>
        </View>

        {/* Weather Section */}
        {siteDiary.weather && (
          <View style={styles.section}>
            <CustomText variant="sectionTitle">Weather</CustomText>
            <WeatherCard weather={siteDiary.weather} />
          </View>
        )}

        {/* Attendees Section */}
        {siteDiary.attendees && siteDiary.attendees.length > 0 && (
          <View style={styles.section}>
            <CustomText variant="sectionTitle">Attendees</CustomText>
            <View>
              {siteDiary.attendees.map((attendee, index) => (
                <AttendeeCard key={index} name={attendee} />
              ))}
            </View>
          </View>
        )}

        {/* Attachments Section */}
        {siteDiary.attachments && siteDiary.attachments.length > 0 && (
          <View style={styles.section}>
            <CustomText variant="sectionTitle">Attachments</CustomText>
            <View style={styles.attachmentsContainer}>
              {siteDiary.attachments.map((attachment, index) => (
                <AttachmentThumbnail key={index} uri={attachment} />
              ))}
            </View>
          </View>
        )}

        {/* Notes Section */}
        {siteDiary.content && (
          <View style={styles.section}>
            <CustomText variant="sectionTitle">Notes</CustomText>
            <CustomText variant="body">{siteDiary.content}</CustomText>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    margin: 16,
    borderRadius: 16,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
