"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PropertyVideo = function (_a) {
    var videoUrl = _a.videoUrl, title = _a.title;
    return (<div className="property-video-container">
    {title && <h2 className="property-video-title">{title}</h2>}
    <video className="property-video-player" src={videoUrl} controls width="100%" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} aria-label={title || 'Property Fantasy Video'}/>
  </div>);
};
exports.default = PropertyVideo;
