import { Request, Response } from 'express';
import DataBase from '../models/DataBase';

export const search = async (req: Request, res: Response) => {
    let text = req.params.text;
    let regex = new RegExp(text, 'i');
    let quiz = await DataBase.find({
        $or: [{ title: regex }, { desc: regex }]
    });

    if(quiz.length >= 1) {
        res.json({ quiz });
    } else {
        res.status(400).json({ error: 'parameter not found' });
    }
}