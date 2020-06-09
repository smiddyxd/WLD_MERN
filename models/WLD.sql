CREATE TABLE `video` (
  `id` String PRIMARY KEY,
  `title` String,
  `channel` String
);

CREATE TABLE `label` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` String,
  `sub_label` boolean DEFAULT false
);

CREATE TABLE `label_assignment` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `label_id` integer,
  `video_id` String
);

CREATE TABLE `playlist` (
  `id` String PRIMARY KEY,
  `title` String,
  `etag` String
);

CREATE TABLE `playlist_item` (
  `playlist_item_id` integer PRIMARY KEY AUTO_INCREMENT,
  `playlist_id` String,
  `video_id` String
);

CREATE TABLE `priority_rating` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `value` ENUM ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10')
);

CREATE TABLE `priority_rating_assignment` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `priority_rating_id` integer,
  `video_id` String
);

CREATE TABLE `channel` (
  `id` String PRIMARY KEY
);

CREATE TABLE `labeling_rule` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `channel_id` String,
  `title_condition` String
);

ALTER TABLE `video` ADD FOREIGN KEY (`channel`) REFERENCES `channel` (`id`);

ALTER TABLE `label_assignment` ADD FOREIGN KEY (`label_id`) REFERENCES `label` (`id`);

ALTER TABLE `label_assignment` ADD FOREIGN KEY (`video_id`) REFERENCES `video` (`id`);

ALTER TABLE `playlist_item` ADD FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`);

ALTER TABLE `playlist_item` ADD FOREIGN KEY (`video_id`) REFERENCES `video` (`id`);

ALTER TABLE `priority_rating_assignment` ADD FOREIGN KEY (`priority_rating_id`) REFERENCES `priority_rating` (`id`);

ALTER TABLE `priority_rating_assignment` ADD FOREIGN KEY (`video_id`) REFERENCES `video` (`id`);

ALTER TABLE `labeling_rule` ADD FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`);
