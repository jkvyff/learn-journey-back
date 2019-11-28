import { Resolver, Mutation, Arg, Query, InputType, Field, Int } from "type-graphql";
import { Resource } from "../entity/Resource";

@InputType()
class ResourceInput {
    @Field()
    title: String

    @Field()
    author: String

    @Field()
    exerpt: String

    @Field()
    resolved_url: String

    @Field(() => Int)
    time_length: number
}

@InputType()
class ResourceUpdateInput {
    @Field()
    title: String

    @Field(() => String, { nullable: true })
    author?: String

    @Field(() => String, { nullable: true })
    exerpt?: String

    @Field()
    resolved_url: String

    @Field(() => Int, { nullable: true })
    time_length: number
}

@Resolver()
export class ResourceResolver {
    @Mutation(() => Resource)
    async createResource(
        @Arg("options", () => ResourceInput) options: ResourceInput
    ) {
        const resource = await Resource.create(options).save();
        console.log(resource);
        return resource;
    }

    @Mutation(() => Boolean)
    async updateResource(
        @Arg("id", () => Int) id: number,
        @Arg("input",  () => ResourceUpdateInput) input: ResourceUpdateInput
    ) {
        await Resource.update({id}, input)
        return true
    }

    @Mutation(() => Boolean)
    async deleteResource(
        @Arg("id", () => Int) id: number
    ) {
        await Resource.delete({id})
        return true
    }

    @Query(() => [Resource]) 
    resources() {
        return Resource.find();
    }
}