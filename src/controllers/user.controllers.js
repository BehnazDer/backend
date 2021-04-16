import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

export const editContact = async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }

    const contactId = req.params._id;
    let user;
    // check if id is valid ObjectId - to resolve mongoose castError
    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      next(Error.notFound('Contact does not exist'));
    } else {
      user = await User.findOneAndUpdate(
        {
          'contacts._id': contactId,
        },
        {
          $set: {
            'contacts.$[contact].name': req.body.name,
            'contacts.$[contact].phone': req.body.phone,
            'contacts.$[contact].message': req.body.message,
          },
        },
        {
          arrayFilters: [{ 'contact._id': contactId }],
          new: true,
        },
      );
      if (!user) {
        next(Error.notFound('Contact does not exist'));
      } else {
        res.status(201).json(user.contacts);
      }
    }
  } catch (e) {
    next(e);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        username: req.params.username,
      },
      ['contacts'],
    );
    if (!user) {
      await next(Error.notFound('User does not exist'));
    } else {
      return res.status(200).send(user);
    }
  } catch (e) {
    next(e);
  }
};

// https://stackoverflow.com/questions/54944980/updateone-returns-a-mongoose-object-and-not-document

export const addContact = async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: {
          contacts: {
            name: req.body.name,
            phone: req.body.phone,
            message: req.body.message,
          },
        },
      },
      { new: true },
    );
    if (!user) {
      await next(Error.notFound('User does not exist'));
    }
    const { contacts } = user;
    return res.status(201).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params._id;
    let user;
    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      next(Error.notFound('Contact does not exist'));
    } else {
      user = await User.findOneAndUpdate(
        { 'contacts._id': contactId },
        {
          $pull: {
            contacts: {
              _id: req.params._id,
            },
          },
        },
        { new: true },
      );
    }
    if (!user) {
      next(Error.notFound('Contact does not exist'));
    } else {
      res.status(202).json(user.contacts);
    }
  } catch (e) {
    next(e);
  }
};
