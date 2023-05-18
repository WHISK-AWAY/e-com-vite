import localStrategy from 'passport-local';
const LocalStrategy = localStrategy.Strategy;
import bcrypt from 'bcrypt';
import { User } from '../database/index';

export function initialize(passport, getUserByEmail, getUserById) {
  // stuff
  async function authenticateUser(email, password, done) {
    console.log('authenticateUser');
    const user = await getUserByEmail(email);
    if (user == null) {
      console.log('user null @ authenticateUser');
      return done(null, false, { message: 'User not found' });
    }
    try {
      const compareResult = await bcrypt.compare(password, user.password);
      console.log('compareResult', compareResult);
      if (compareResult) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (err) {
      return done(err);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser(async (user, done) => {
    //serialize
    console.log('serializeUser:', user.id);
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    //deserialize
    console.log('deserializeUser:', id);
    const user = await User.findById(id);
    // console.log('user @ deserializeUser:', user);
    return done(null, user);
  });
}

// import passport, { PassportStatic } from 'passport';
// import passportLocal from 'passport-local';
// const LocalStrategy = passportLocal.Strategy;
// import bcrypt from 'bcrypt';

// import { User } from '../database/index';

// // async function getUserByEmail (email: string) {
// //   // look up user by email address
// //   const user = await User.findOne({email}); // user or null
// //   return user;
// // }

// export const appPassport = passport;
// export const passportInit = passport.initialize();
// export const appSession = passport.session();

// async function getUserById(userId: string) {
//   console.log('getUserById');
//   try {
//     const user = await User.findById(userId);
//     return user;
//   } catch (err) {
//     throw err;
//   }
// }

// // initializePassport(passport);

// export function initializePassport(passport: PassportStatic) {
//   const authenticateUser: passportLocal.VerifyFunction = async (
//     email: string,
//     password: string,
//     done: any
//   ) => {
//     console.log('authenticateUser()');
//     try {
//       const user = await User.findOne({ email });
//       if (!user) {
//         return done(null, false, { message: 'User not found' });
//       }

//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: 'Incorrect password' });
//       }
//     } catch (err) {
//       return done(err);
//     }
//   };

//   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

//   passport.serializeUser((user, done) => {
//     console.log('serializeUser');
//     return done(null, user);
//   });

//   passport.deserializeUser(async (id: string, done) => {
//     console.log('deserializeUser');
//     const user = await getUserById(id);
//     return done(null, user);
//   });
// }
