// src/screens/AddMovieScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMovie, updateMovie } from '../services/api';
import { Button, Input } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { showAlert } from '../utils/helpers';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror',
  'Sci-Fi', 'Romance', 'Thriller', 'Animation',
];

export default function AddMovieScreen({ navigation, route }) {
  const onSuccess = route.params?.onSuccess;
  const editMovie = route.params?.movie; // If editing, this will have movie data
  const isEditing = !!editMovie;

  const [form, setForm] = useState({
    title: editMovie?.title || '',
    description: editMovie?.description || '',
    poster_url: editMovie?.poster_url || '',
    genre: editMovie?.genre || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.genre) newErrors.genre = 'Please select a genre';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await updateMovie(editMovie.id || editMovie._id, form);
        showAlert('Movie Updated! ✅', `"${form.title}" has been updated.`, [
          {
            text: 'Done',
            onPress: () => {
              onSuccess?.();
              navigation.goBack();
            },
          },
        ]);
      } else {
        await addMovie(form);
        showAlert('Movie Added! 🎬', `"${form.title}" has been added to the catalog.`, [
          {
            text: 'Done',
            onPress: () => {
              onSuccess?.();
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      showAlert(isEditing ? 'Failed to Update' : 'Failed to Add Movie', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Movie' : 'Add New Movie'}</Text>
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Banner */}
          <View style={styles.previewBanner}>
            <Text style={styles.previewEmoji}>🎬</Text>
            <View>
              <Text style={styles.previewTitle}>
                {form.title || 'Movie Title'}
              </Text>
              <Text style={styles.previewGenre}>
                {form.genre || 'Genre'}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="Movie Title"
              placeholder="e.g. Inception"
              value={form.title}
              onChangeText={(v) => setForm({ ...form, title: v })}
              autoCapitalize="words"
              error={errors.title}
            />
            <Input
              label="Description"
              placeholder="Brief synopsis of the movie..."
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              autoCapitalize="sentences"
              error={errors.description}
            />
            <Input
              label="Poster URL (optional)"
              placeholder="https://example.com/poster.jpg"
              value={form.poster_url}
              onChangeText={(v) => setForm({ ...form, poster_url: v })}
              keyboardType="url"
            />

            {/* Genre Picker */}
            <View style={styles.genreSection}>
              <Text style={styles.genreLabel}>GENRE</Text>
              <View style={styles.genreGrid}>
                {GENRES.map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => {
                      setForm({ ...form, genre: g });
                      setErrors({ ...errors, genre: '' });
                    }}
                    style={[
                      styles.genreChip,
                      form.genre === g && styles.genreChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genreChipText,
                        form.genre === g && styles.genreChipTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.genre && (
                <Text style={styles.errorText}>{errors.genre}</Text>
              )}
            </View>
          </View>

          <Button
            title={isEditing ? '✅  Update Movie' : '🎬  Add Movie'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.addBtn}
          />

          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.cancelBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: { color: COLORS.text, fontSize: FONTS.sizes.xl },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },

  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    backgroundColor: COLORS.primaryGlow,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: `${COLORS.primary}44`,
    marginBottom: SPACING.xl,
  },
  previewEmoji: { fontSize: 36 },
  previewTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  previewGenre: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: 2,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },

  genreSection: { marginTop: SPACING.sm },
  genreLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  genreChip: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  genreChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  genreChipText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  genreChipTextActive: { color: COLORS.primary },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.sm,
  },

  addBtn: { marginBottom: SPACING.sm },
  cancelBtn: {},
});
