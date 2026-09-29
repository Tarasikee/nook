import 'csstype'

// Interest invoker timing, too new for csstype. Vanilla-extract writes it out as `interest-delay`.
declare module 'csstype' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- a merged interface must repeat csstype's type parameters
    interface Properties<TLength, TTime> {
        interestDelay?: TTime | `${TTime} ${TTime}`
        interestDelayStart?: TTime
    }
}
