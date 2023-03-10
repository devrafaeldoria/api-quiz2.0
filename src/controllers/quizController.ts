import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';
import DataBase from '../models/DataBase';
import User from '../models/User';

export const allQuiz = async (req: Request, res: Response) => {
    let quizzes = await DataBase.find({});

    res.json({ quizzes: quizzes });
}

export const idQuiz = async (req: Request, res: Response) => {
    let id = req.params.id;

    if(id) {
        if(mongoose.Types.ObjectId.isValid(id)) {
            let quiz = await DataBase.findById(id);

            if(quiz) {
                res.json({ quiz });
            } else {
                return res.status(400).json({ error: 'quiz not exist' });
            }

        } else {
            return res.status(400).json({ error: 'id is not valid' });
        }
    } else {
        res.status(400).json({ error: 'missing data' });
    }
    
}

export const filterQuiz = async (req: Request, res: Response) => {
   
    if(req.params.offset && req.params.pageNumber) {
        let offset: number = parseInt(req.params.offset);
        let pageNumber: number = parseInt(req.params.pageNumber) - 1;

        if(pageNumber >= 0) {

            let quiz = await DataBase.find({}).limit(offset).skip(pageNumber);

            res.json({ quizzes: quiz });
        } else {
            return res.status(400).json({ error: 'page invalid' });
        }

    } else {
        return res.status(400).json({ error: 'missing data' });
    }

}

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const quizId = req.params.idQuiz;
    const userQuiz = await User.findOne({
        data_bases: quizId,
        _id: userId
    });

    if (!quizId) {
        return res.status(400).json({ error: 'missing data' });
    }

    if(userQuiz) {

        await DataBase.deleteOne({
            _id: quizId
        }).then(() => {
            res.json({ delete: true });
        }).catch((err) => {
            console.log(err);
            res.json({ delete: false });
        });

    } else {
        res.status(401).json({ error: 'not authorized, only users quiz' });
    }

}

export const playQuiz = async (req: Request, res: Response) => {
    if(req.params.idQuiz) {
        const idQuiz = req.params.idQuiz;

        if(mongoose.Types.ObjectId.isValid(idQuiz)) {
            let hasQuiz = await DataBase.findById(idQuiz);

            // add more one count in plays for quiz
            if(hasQuiz) {
                let plays = hasQuiz.plays;
                hasQuiz.plays = plays + 1;
                await hasQuiz.save();

                res.json({ questions: hasQuiz.questions });

            } else {
                return res.status(400).json({ error: 'quiz not found' });
            }


        } else {
        return res.status(400).json({ error: 'id is not valid' });
        }

    } else {    
        return res.status(400).json({ error: 'missing data' });
    }
}