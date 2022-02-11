const fileService = require('../services/fileService');
const User = require('../models/User');
const File = require('../models/File');
const config = require('config');
const fs = require('fs');

class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body;
            const file = new File({ name, type, parent, user: req.user.id });
            const parentFile = await File.findOne({ _id: parent });
            if (!parentFile) {
                file.path = name;
                await fileService.createDir(file);
            } else {
                file.path = `${parentFile.path}/${parentFile.name}`;
                await fileService.createDir(file);
                parentFile.childs.push(file._id);
                await parentFile.save();
            }
            await file.save();
            return res.json(file);
        } catch (error) {
            console.log(error);
            return res.status(400).json(error);
        }
    }

    async getFiles(req, res) {
        try {
            const { sort } = req.query;
            let files = null;

            switch (sort) {
                case 'name':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: -1 });
                case 'type':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: -1 });
                case 'date':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: -1 });

                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent });
                    break;
            }

            return res.json({ files });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Can not get files" });
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file;
            //const file = req.body.file;
            //const fileParsed = JSON.parse(file);
            console.log(file);

            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent });
            const user = await User.findOne({ _id: req.user.id });


            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: "No space on the disk" })
            }

            user.usedSpace = user.usedSpace + file.size;

            let path, pathUserId, pathUserIdAndParent;
            if (parent) {
                pathUserIdAndParent = `${config.get('filePath')}/${user._id}/${parent.path}`;
                path = `${config.get('filePath')}/${user._id}/${parent.path}/${file.name}`;
            } else {
                pathUserId = `${config.get('filePath')}/${user._id}`;
                path = `${config.get('filePath')}/${user._id}/${file.name}`;
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'File allready existsрпр' });
            }
            else {
                if (parent) {
                    fs.mkdirSync(pathUserIdAndParent, { recursive: true });
                    file.mv(path);
                } else {
                    fs.mkdirSync(pathUserId, { recursive: true });
                    file.mv(path);
                }
            }
            //const type = fileParsed.name.split('.').pop();
            const type = file.name.split('.').pop();
            let filePath = file.name;
            if (parent) {
                filePath = `${parent.path}/${file.name}`
            }
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent?._id,
                user: user._id
            });

            await dbFile.save();
            await user.save();

            res.json(dbFile);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Upload error" });
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query._id, user: req.user.id });
            console.log("file" + file.name);
            const path = `${config.get('filePath')}/${req.user.id}/${file.path}/${file.name}`;

            if (fs.existsSync(path)) {
                return res.download(path, file.name);
            }
            return res.status(400).json({ message: "Download error" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Download error" });
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id });
            if (!file) {
                return res.status(400).json({ message: "File not found" });
            }
            fileService.deleteFile(file);
            await file.remove();
            return res.json({ message: "File was deleted" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Dir is not empty" });
        }
    }
}

module.exports = new FileController();