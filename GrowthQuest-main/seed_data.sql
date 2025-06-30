-- Insert daily quests
INSERT INTO daily_quests (title, description, type, xp_reward, requirement, is_active) VALUES
('Complete 3 Goals', 'Mark 3 goals as completed today', 'complete_goal', 100, 3, true),
('Journal Entry', 'Write a journal entry about your day', 'journal_entry', 50, 1, true),
('Social Share', 'Share your progress with the community', 'social_interaction', 75, 1, true),
('Daily Login', 'Login to TranscendUp', 'login', 25, 1, true),
('Achievement Hunter', 'Earn any achievement today', 'achievement', 150, 1, true);

-- Insert titles
INSERT INTO titles (name, description, required_level, color, rarity) VALUES
('Novice Explorer', 'Welcome to your journey!', 1, '#3B82F6', 'common'),
('Goal Crusher', 'Complete 10 goals', 5, '#10B981', 'rare'),
('Journal Master', 'Write 20 journal entries', 8, '#8B5CF6', 'epic'),
('Community Hero', 'Help others in the community', 12, '#F59E0B', 'legendary'),
('XP Champion', 'Reach 5000 XP', 15, '#EF4444', 'legendary'),
('Progress Tracker', 'Log 50 progress entries', 10, '#06B6D4', 'epic');

-- Insert badges
INSERT INTO badges (name, description, icon, category, rarity, color, requirement) VALUES
('First Steps', 'Complete your first goal', 'star', 'achievement', 'common', '#6B7280', '{"type": "goals_completed", "value": 1}'),
('Consistent', 'Maintain a 7-day streak', 'flame', 'streak', 'rare', '#F59E0B', '{"type": "streak", "value": 7}'),
('Social Butterfly', 'Make 5 community posts', 'users', 'social', 'rare', '#8B5CF6', '{"type": "community_posts", "value": 5}'),
('Level Up', 'Reach level 10', 'trophy', 'level', 'epic', '#10B981', '{"type": "level", "value": 10}'),
('XP Master', 'Earn 10000 XP', 'zap', 'xp', 'legendary', '#EF4444', '{"type": "xp", "value": 10000}'),
('Journal Writer', 'Write 10 journal entries', 'book', 'journal', 'epic', '#06B6D4', '{"type": "journal_entries", "value": 10}');

-- Insert achievements
INSERT INTO achievements (name, description, icon, category, requirement, xp_reward, rarity) VALUES
('Goal Getter', 'Complete your first goal', 'target', 'goals', '{"type": "goals_completed", "value": 1}', 50, 'common'),
('Habit Builder', 'Complete 10 goals', 'repeat', 'goals', '{"type": "goals_completed", "value": 10}', 200, 'rare'),
('Streak Master', 'Maintain a 30-day streak', 'flame', 'streaks', '{"type": "streak", "value": 30}', 500, 'epic'),
('Community Leader', 'Get 100 likes on your posts', 'heart', 'social', '{"type": "post_likes", "value": 100}', 300, 'rare'),
('XP Collector', 'Earn 5000 XP', 'star', 'xp', '{"type": "xp", "value": 5000}', 1000, 'legendary'),
('Early Bird', 'Login for 7 consecutive days', 'sunrise', 'engagement', '{"type": "daily_logins", "value": 7}', 150, 'rare');

-- Insert loot items
INSERT INTO loot_items (name, description, type, rarity, icon_url) VALUES
('XP Boost', 'Double XP for the next goal completion', 'boost', 'common', '/icons/xp-boost.svg'),
('Streak Shield', 'Protect your streak for one day', 'protection', 'rare', '/icons/shield.svg'),
('Goal Multiplier', 'Get 50% more XP from goals for 24 hours', 'multiplier', 'epic', '/icons/multiplier.svg'),
('Achievement Finder', 'Reveal one hidden achievement', 'reveal', 'legendary', '/icons/finder.svg'),
('Motivation Quote', 'Inspiring message for your dashboard', 'cosmetic', 'common', '/icons/quote.svg');

-- Insert rewards
INSERT INTO rewards (name, description, type, value, rarity, icon_url) VALUES
('Bronze Loot Box', 'Contains 1-2 common items', 'loot_box', 1, 'common', '/icons/bronze-box.svg'),
('Silver Loot Box', 'Contains 1-3 items, rare chance', 'loot_box', 2, 'rare', '/icons/silver-box.svg'),
('Gold Loot Box', 'Contains 2-4 items, epic chance', 'loot_box', 3, 'epic', '/icons/gold-box.svg'),
('Diamond Loot Box', 'Contains 3-5 items, legendary chance', 'loot_box', 4, 'legendary', '/icons/diamond-box.svg'),
('Instant XP', 'Gain 100 XP instantly', 'xp', 100, 'common', '/icons/instant-xp.svg');
