const SiteContent = require('../models/SiteContent');

exports.getContent = async (req, res) => {
  try {
    const content = await SiteContent.findOne({ key: req.params.key });
    if (!content) {
      return res.json({ key: req.params.key, data: null });
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const allContent = await SiteContent.find({});
    const result = {};
    allContent.forEach(c => { result[c.key] = c.data; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.upsertContent = async (req, res) => {
  try {
    const { key, data } = req.body;
    if (!key || data === undefined) {
      return res.status(400).json({ message: 'Key and data are required' });
    }
    const content = await SiteContent.findOneAndUpdate(
      { key },
      { key, data },
      { upsert: true, new: true }
    );
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    await SiteContent.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
