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
    date_published: Date

    @Field()
    resolved_url: String

    @Field(() => Int)
    time_length: number
}

@Resolver()
export class ResourceResolver {
    @Mutation(() => Resource)
    async createResource(
        @Arg("input") input: ResourceInput
    ) {
        const resource = await Resource.insert(input);
        console.log(resource);
        return ;
    }

    @Query(() => [Resource]) 
    resources() {

    }
}