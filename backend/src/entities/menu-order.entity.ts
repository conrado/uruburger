import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity()
export class MenuOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qrCodeLink: string;

  @ManyToMany(() => MenuItem)
  @JoinTable()
  items: MenuItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('json')
  eventLog: Array<{
    timestamp: Date;
    event: string;
    details: any;
  }>;
}
