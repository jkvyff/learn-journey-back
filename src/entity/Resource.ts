import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Resource extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number
    
    @Field()
    @Column('text')
    title: String

    @Field()
    @Column('text')
    author: String

    @Field()
    @Column('text')
    exerpt: String

    @Field()
    @Column('text')
    resolved_url: String

    @Field(() => Int)
    @Column('int')
    time_length: number
}