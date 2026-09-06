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

User.belongsTo(Song, { foreignKey: 'favorite_song_uuid', targetKey: 'uuid', as: 'favoriteSong' });
Artist.belongsTo(Song, { foreignKey: 'favorite_song_uuid', targetKey: 'uuid', as: 'favoriteSong' });

Artist.hasMany(Album, { foreignKey: 'artist_uuid', sourceKey: 'uuid' });
Album.belongsTo(Artist, { foreignKey: 'artist_uuid', targetKey: 'uuid' });
Artist.hasMany(Song, { foreignKey: 'artist_uuid', sourceKey: 'uuid', as: 'songs' });
Song.belongsTo(Artist, { foreignKey: 'artist_uuid', targetKey: 'uuid', as: 'artist' });
Album.hasMany(Song, { foreignKey: 'album_uuid', sourceKey: 'uuid' });
Song.belongsTo(Album, { foreignKey: 'album_uuid', targetKey: 'uuid' });

User.hasMany(Post, { foreignKey: 'author_uuid', sourceKey: 'uuid', constraints: false, scope: { authorType: 'user' } });
Artist.hasMany(Post, { foreignKey: 'author_uuid', sourceKey: 'uuid', constraints: false, scope: { authorType: 'artist' } });
Post.belongsTo(User, { foreignKey: 'author_uuid', targetKey: 'uuid', constraints: false, as: 'userAuthor' });
Post.belongsTo(Artist, { foreignKey: 'author_uuid', targetKey: 'uuid', constraints: false, as: 'artistAuthor' });

Post.hasMany(Comment, { foreignKey: 'post_uuid', sourceKey: 'uuid' });
Comment.belongsTo(Post, { foreignKey: 'post_uuid', targetKey: 'uuid' });
User.hasMany(Comment, { foreignKey: 'actor_uuid', sourceKey: 'uuid', constraints: false, scope: { actor_type: 'user' } });
Comment.belongsTo(User, { foreignKey: 'actor_uuid', targetKey: 'uuid', constraints: false, as: 'userActor' });
Artist.hasMany(Comment, { foreignKey: 'actor_uuid', sourceKey: 'uuid', constraints: false, scope: { actor_type: 'artist' } });
Comment.belongsTo(Artist, { foreignKey: 'actor_uuid', targetKey: 'uuid', constraints: false, as: 'artistActor' });

User.hasMany(Like, { foreignKey: 'actor_uuid', sourceKey: 'uuid', constraints: false, scope: { actor_type: 'user' } });
Like.belongsTo(User, { foreignKey: 'actor_uuid', targetKey: 'uuid', constraints: false, as: 'userActorLike' });
Artist.hasMany(Like, { foreignKey: 'actor_uuid', sourceKey: 'uuid', constraints: false, scope: { actor_type: 'artist' } });
Like.belongsTo(Artist, { foreignKey: 'actor_uuid', targetKey: 'uuid', constraints: false, as: 'artistActorLike' });

User.hasMany(Follow, { foreignKey: 'follower_uuid', sourceKey: 'uuid' });
Follow.belongsTo(User, { foreignKey: 'follower_uuid', targetKey: 'uuid' });

User.hasMany(Playlist, { foreignKey: 'user_uuid', sourceKey: 'uuid' });
Playlist.belongsTo(User, { foreignKey: 'user_uuid', targetKey: 'uuid' });
Playlist.hasMany(PlaylistSong, { foreignKey: 'playlist_uuid', sourceKey: 'uuid' });
PlaylistSong.belongsTo(Playlist, { foreignKey: 'playlist_uuid', targetKey: 'uuid' });
Song.hasMany(PlaylistSong, { foreignKey: 'song_uuid', sourceKey: 'uuid' });
PlaylistSong.belongsTo(Song, { foreignKey: 'song_uuid', targetKey: 'uuid' });

Artist.hasMany(Merchandise, { foreignKey: 'artist_uuid', sourceKey: 'uuid' });
Merchandise.belongsTo(Artist, { foreignKey: 'artist_uuid', targetKey: 'uuid' });
User.hasMany(Order, { foreignKey: 'user_uuid', sourceKey: 'uuid' });
Order.belongsTo(User, { foreignKey: 'user_uuid', targetKey: 'uuid' });
Order.hasMany(OrderItem, { foreignKey: 'order_uuid', sourceKey: 'uuid' });
OrderItem.belongsTo(Order, { foreignKey: 'order_uuid', targetKey: 'uuid' });
Merchandise.hasMany(OrderItem, { foreignKey: 'merch_uuid', sourceKey: 'uuid' });
OrderItem.belongsTo(Merchandise, { foreignKey: 'merch_uuid', targetKey: 'uuid' });
