import MongoStore from "connect-mongo";
import type { RequestHandler } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    messages: string[];
  }
}

export class Session {
  public static SessionHandler(): RequestHandler {
    return session({
      secret: "keyboard cat",
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until stored
      store: MongoStore.create({
        mongoUrl: process.env["MongoConnectionString"]!,
        collectionName: "sessions",
      }),
    });
  }

  public static MessagesHandler(): RequestHandler {
    return (req, res, next) => {
      var msgs = req.session.messages || [];
      res.locals["messages"] = msgs;
      res.locals["hasMessages"] = !!msgs.length;
      req.session.messages = [];
      next();
    };
  }
}
