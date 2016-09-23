/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {loadScript} from './3p';

/**
 * Get the correct script for the container.
 * @param {!Window} global
 * @param {!String} scriptSource The source of the script, different for post and comment embeds.
 */
function getContainerScript(global, scriptSource) {
  loadScript(global, scriptSource, () => {});
}

/**
 * Embedly looks for a blockquote with a '-card' suffixed class.
 * @return {!Element} blockquote
 */
function getPostContainer() {
  const blockquote = global.document.createElement('blockquote');
  blockquote.className += 'reddit-card';
  blockquote.setAttribute('data-card-created', Math.floor(Date.now() / 1000));
  return blockquote;
}

/**
 * @param {!Object} data The element data
 * @return {!Element} div
 */
function getCommentContainer(data) {
  const div = global.document.createElement('div');
  div.className = 'reddit-embed';
  div.setAttribute('data-embed-media', 'www.redditmedia.com');
  // 'uuid' and 'created' are provided by the embed script, but don't seem
  // to actually be needed. Account for them, but let them default to undefined.
  div.setAttribute('data-embed-uuid', data.uuid);
  div.setAttribute('data-embed-created', data.embedcreated);
  div.setAttribute('data-embed-parent', data.embedparent || 'false');
  div.setAttribute('data-embed-live', data.embedlive || 'false');

  return div;
}

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function reddit(global, data) {
  let container;
  let scriptSource;

  // Post and comment embeds are handled totally differently.
  if (data.embedtype === 'post') {
    container = getPostContainer();
    scriptSource = 'https://embed.redditmedia.com/widgets/platform.js';
  } else if (data.embedtype === 'comment') {
    container = getCommentContainer(data);
    scriptSource = 'https://www.redditstatic.com/comment-embed.js';
  }

  const link = global.document.createElement('a');
  link.href = data.src;

  container.appendChild(link);
  global.document.getElementById('c').appendChild(container);

  getContainerScript(global, scriptSource);
}
