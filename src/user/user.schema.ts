import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { AbstractModel } from '../abstract/abstract.model';


@Schema({
  timestamps: true,
})
export class User extends AbstractModel {
  @Prop({ required: false, type: SchemaTypes.String })
  firstName: string;
  @Prop({ required: false, type: SchemaTypes.String })
  lastName: string;
  @Prop({ required: false, type: SchemaTypes.String })
  address?: string;
  @Prop({ required: false, type: SchemaTypes.String })
  phoneNumber?: string;
  @Prop({ required: false, type: SchemaTypes.Date })
  birthday: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
