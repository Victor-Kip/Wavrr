import Album from './album.js';
import Artist from './artist.js';
import Comment from './comment.js';
import Follow from './follow.js';
import Like from './like.js';
import Merchandise from './merchandise.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Playlist from './playlist.js';
import PlaylistSong from './playlistSong.js';
import Post from './post.js';
import Song from './song.js';
import User from './user.js';

// --- CORE FAVORITES ---
User.belongsTo(Song, { foreignKey: 'favorite_song_id', as: 'favoriteSong' });
Artist.belongsTo(Song, { foreignKey: 'favorite_song_id', as: 'favoriteSong' });

// --- MUSIC RELATIONSHIPS ---
Artist.hasMany(Album, { foreignKey: 'artist_id' });
Album.belongsTo(Artist, { foreignKey: 'artist_id' });

Artist.hasMany(Song, {
    foreignKey: 'artist_uuid',
    sourceKey: 'uuid',
    as: 'songs'
});
Song.belongsTo(Artist, {
    foreignKey: 'artist_uuid',
    targetKey: 'uuid',
    as: 'artist'
});

Album.hasMany(Song, { foreignKey: 'album_id' });
Song.belongsTo(Album, { foreignKey: 'album_id' });

// --- SOCIAL FEED (Post Polymorphism) ---
User.hasMany(Post, {
    foreignKey: 'author_uuid',
    sourceKey: 'uuid',
    constraints: false,
    scope: { authorType: 'user' }
});
Artist.hasMany(Post, {
    foreignKey: 'author_uuid',
    sourceKey: 'uuid',
    constraints: false,
    scope: { authorType: 'artist' }
});

Post.belongsTo(User, { 
    foreignKey: 'author_uuid',
    targetKey: 'uuid',
    constraints: false, 
    as: 'userAuthor' 
});
Post.belongsTo(Artist, { 
    foreignKey: 'author_uuid',
    targetKey: 'uuid',
    constraints: false, 
    as: 'artistAuthor' 
});

// --- COMMENTS & LIKES ---
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'actor_id', constraints: false, scope: { actor_type: 'user' } });
Comment.belongsTo(User, { foreignKey: 'actor_id', constraints: false, as: 'userActor', scope: { actor_type: 'user' } });

Artist.hasMany(Comment, { foreignKey: 'actor_id', constraints: false, scope: { actor_type: 'artist' } });
Comment.belongsTo(Artist, { foreignKey: 'actor_id', constraints: false, as: 'artistActor', scope: { actor_type: 'artist' } });

User.hasMany(Like, { foreignKey: 'actor_id', constraints: false, scope: { actor_type: 'user' } });
Like.belongsTo(User, { foreignKey: 'actor_id', constraints: false, as: 'userActorLike', scope: { actor_type: 'user' } });

Artist.hasMany(Like, { foreignKey: 'actor_id', constraints: false, scope: { actor_type: 'artist' } });
Like.belongsTo(Artist, { foreignKey: 'actor_id', constraints: false, as: 'artistActorLike', scope: { actor_type: 'artist' } });

// --- FOLLOW SYSTEM ---
User.hasMany(Follow, { foreignKey: 'follower_id' });
Follow.belongsTo(User, { foreignKey: 'follower_id' });
// Following can be User or Artist (Handled by following_type in the model)

// --- PLAYLISTS ---
User.hasMany(Playlist, { foreignKey: 'user_id' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

Playlist.hasMany(PlaylistSong, { foreignKey: 'playlist_id' });
PlaylistSong.belongsTo(Playlist, { foreignKey: 'playlist_id' });

Song.hasMany(PlaylistSong, { foreignKey: 'song_id' });
PlaylistSong.belongsTo(Song, { foreignKey: 'song_id' });

// --- COMMERCE (MERCH & ORDERS) ---
Artist.hasMany(Merchandise, { foreignKey: 'artist_id' });
Merchandise.belongsTo(Artist, { foreignKey: 'artist_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Merchandise.hasMany(OrderItem, { foreignKey: 'merch_id' });
OrderItem.belongsTo(Merchandise, { foreignKey: 'merch_id' });
