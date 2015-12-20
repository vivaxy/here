/**
 * @since 2015-12-20 20:56
 * @author vivaxy
 */
'use strict';

var commentContainerList = document.querySelectorAll('.js-comment-container');

var validCommentContainerList = Array.prototype.filter.call(commentContainerList, function (commentContainer) {
    return commentContainer.style.display !== 'none';
});

var commentList = validCommentContainerList.map(function (commentContainer) {
    return commentContainer.querySelector('.js-comment');
});

var validCommentList = commentList.filter(function (comment) {
    return comment;
});

var commentIdList = validCommentList.map(function (comment) {
    var longId = comment.id;
    var longIdSplit = longId.split('-');
    return longIdSplit[1];
});

var listString = commentIdList.join('\n');

window.prompt('Copy to clipboard: Ctrl+C, Enter', listString);
// run in browser
// paste in list.txt
