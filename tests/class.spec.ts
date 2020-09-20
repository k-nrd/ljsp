import { eva, e } from './tests.setup'

//
// Class declaration
//
test('evaluate user defined class', () => {
  expect(eva.run(e`
        (class Point null
            (begin
                (def constructor (this x y)
                    (begin
                        (set (prop this x) x)
                        (set (prop this y) y)))

                (def calc (this)
                    (+ (prop this x) (prop this y)))))

        (var p (new Point 10 20))

        ((prop p calc) p)
    `,
  )).toEqual(30)
})

test('evaluate class inheritance', () => {
  expect(eva.run(e`
        (class Point null
            (begin
                (def constructor (this x y)
                    (begin
                        (set (prop this x) x)
                        (set (prop this y) y)))

                (def calc (this)
                    (+ (prop this x) (prop this y)))))

        (class Point3D Point
            (begin
                (def constructor (this x y z)
                    (begin
                        ((prop (super Point3D) constructor) this x y)
                        (set (prop this z) z)))

                (def calc (this)
                    (+ ((prop (super Point3D) calc) this)
                        (prop this z)))))

        (var p (new Point3D 10 20 5))

        ((prop p calc) p)
    `,
  )).toEqual(35)
})
